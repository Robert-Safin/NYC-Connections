use super::{historic, llm};
use axum::{
    http::{
        header::{AUTHORIZATION, CONTENT_TYPE},
        HeaderValue
    },
    routing::get,
    Router,
};

use tower_http::cors::{Any, CorsLayer};

pub async fn init_server() {
    let cors_layer = CorsLayer::new()
        .allow_methods(Any)
        .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
        .allow_headers([AUTHORIZATION, CONTENT_TYPE]);

    let app = Router::new()
        .route("/start_historic", get(historic::start_historic))
        .route("/start_llm", get(llm::start_llm))
        .layer(cors_layer);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
