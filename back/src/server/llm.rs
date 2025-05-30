use ollama_rs::{
    generation::chat::{ChatMessage, MessageRole},
    Ollama,
};
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
use axum::{http::StatusCode, Json};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AnswerGroup {
    #[serde(rename = "answerDescription")]
    pub answer_description: String,
    pub words: Vec<String>,
}

pub async fn start_llm() -> Result<Json<HistoricGame>, StatusCode> {
    let mut ollama = Ollama::default();
    let model = "llama3.2:latest".to_string();
    let prompt = "Generate words for a game of connections".to_string();

    let mut history = vec![ChatMessage {
        role: MessageRole::System,
        content: r#"
        Generate a Connections-style word game similar to the New York Times 'Connections' puzzle.
        Each group should be based on a distinct and creative theme. Themes can include literal categories (e.g., colors, animals), synonyms or antonyms, wordplay (e.g., anagrams, homophones), cultural references (e.g., movie titles, song genres), or thematic groupings (e.g., kitchen items, modes of transportation).
        Avoid overlap or ambiguity between categories.
        Ensure there are exactly 16 words forming exactly 4 categories. The same word can not belong in multiple categories.
        Return the result as a JSON object with the following structure:

        {
            "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8", "word9", "word10", "word11", "word12", "word13", "word14", "word15", "word16",],
            "answers": [
                {
                    "answerDescription": "CATEGORY_NAME1",
                    "words": ["word1", "word2", "word3", "word4"]
                },
                {
                    "answerDescription": "CATEGORY_NAME2",
                    "words": ["word5", "word6", "word7", "word8"]
                },
                {
                    "answerDescription": "CATEGORY_NAME3",
                    "words": ["word9", "word10", "word11", "word12"]
                },
                {
                    "answerDescription": "CATEGORY_NAME4",
                    "words": ["word13", "word4", "word15", "word16"]
                },
                ...
            ]
        }
        "#.to_string(),
        tool_calls: vec![],
        images: None,
    }];

    let response = ollama
        .send_chat_messages_with_history(
            &mut history,
            ollama_rs::generation::chat::request::ChatMessageRequest::new(
                model,
                vec![ChatMessage::user(prompt)],
            ),
        )
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let raw = response.message.content;

    // Try to extract JSON substring
    let json_start = raw.find('{').ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let json_end = raw.rfind('}').ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let json_str = &raw[json_start..=json_end];

    let parsed: HistoricGame =
        serde_json::from_str(json_str).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(parsed))
}
