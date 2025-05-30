mod server;
mod word_gen;

#[tokio::main]
async fn main() {
    server::server::init_server().await;
}
