use rand::prelude::*;
use serde::{Deserialize, Serialize};
use std::fs;


#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct HistoricGame {
    pub date: String,
    pub contest: String,
    pub words: Vec<String>,
    pub answers: Vec<Answer>,
    pub difficulty: Option<f64>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Answer {
    #[serde(rename = "answerDescription")]
    pub answer_description: String,
    pub words: Vec<String>,
}

pub async fn start_historic() -> String {
    let contents =
        fs::read_to_string("dataset.json").expect("Should have been able to read the file");

    let games: Vec<HistoricGame> = serde_json::from_str(&contents).expect("Failed to parse JSON");

    let mut rng = rand::rng();

    let mut nums: Vec<i32> = (0..games.len() as i32).collect();
    nums.shuffle(&mut rng);

    let n = nums.choose(&mut rng).expect("failed to pick a number");
    let selected_game = &games[*n as usize];

    // Serialize the selected game to a JSON string
    let json = serde_json::to_string(selected_game).expect("Failed to serialize game");

    json
}
