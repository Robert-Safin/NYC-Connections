use axum::{http::StatusCode, response::IntoResponse, Json};
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
pub async fn start_historic() -> impl IntoResponse {
    let contents =
        fs::read_to_string("dataset.json").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let games: Vec<HistoricGame> =
        serde_json::from_str(&contents).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if games.is_empty() {
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    let mut rng = rand::rng();
    let game = games
        .choose(&mut rng)
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(game.clone()))
}
