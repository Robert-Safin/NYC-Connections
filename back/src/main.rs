mod server;
mod utils;

#[tokio::main]
async fn main() {
    server::server::init_server().await;
}
