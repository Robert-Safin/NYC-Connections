use super::{historic, llm};
use axum::{routing::get, Router};

pub async fn init_server() {
    let app = Router::new()
        .route("/start_historic", get(historic::start_historic))
        .route("/start_llm", get(llm::start_llm));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
