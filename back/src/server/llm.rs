use ollama_rs::generation::chat::request;
use ollama_rs::generation::chat::ChatMessage;
use ollama_rs::generation::chat::MessageRole;
use ollama_rs::Ollama;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct HistoricGame {
    pub words: Vec<String>,
    pub answers: Vec<Answer>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Answer {
    #[serde(rename = "answerDescription")]
    pub answer_description: String,
    pub words: Vec<String>,
}

pub async fn start_llm() -> String {
    let mut ollama = Ollama::default();
    let model = "llama3.2:latest".to_string();
    let prompt = "Generate a words for a game of connections".to_string();

    let mut history = vec![];
    history.push(ChatMessage {
    role: MessageRole::System,
    content: r#"
    Generate a Connections-style word game similar to the New York Times 'Connections' puzzle.
    Provide exactly 16 words that can be grouped into 4 categories of 4 words each.
    Each group should be based on a distinct and creative theme. Themes can include literal categories (e.g., colors, animals), synonyms or antonyms, wordplay (e.g., anagrams, homophones), cultural references (e.g., movie titles, song genres), or thematic groupings (e.g., kitchen items, modes of transportation).
    Avoid overlap or ambiguity between categories.
    Be creative but ensure that the categories are clear and logical. Use only plain English words (no phrases or proper nouns unless relevant to the theme).
    Output only the JSON, nothing else.
    Return the result as a JSON object with the following structure:

  {
    "words": ["word1", "word2", "word3", "word4", ...],
    "answers": [
      {
        "answerDescription": "CATEGORY_NAME",
        "words": ["word1", "word2", "word3", "word4"]
      },
      ...
    ]
  }
"#.to_string(),
    tool_calls: vec![],
    images: None,
});

    let res = ollama
        .send_chat_messages_with_history(
            &mut history,
            request::ChatMessageRequest::new(model, vec![ChatMessage::user(prompt)]),
        )
        .await;

    let raw_response = res.unwrap().message.content;
    let json_start = raw_response.find('{').unwrap();
    let json_end = raw_response.rfind('}').unwrap();
    let json_str = &raw_response[json_start..=json_end];
    let parsed: HistoricGame =
        serde_json::from_str(json_str).expect("failed to parse LLM response into struct");

    let json = serde_json::to_string(&parsed).expect("Failed to serialize game");

    json
}
