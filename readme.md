# About

Locally runs New York Times' game of connections. With 2 modes:

### Archives

Pulls up a random game from achieve data dump.

### LLM generated

LLM generated game via an ollama model of user's choice. Will require ollama and a model locally installed. The backend will attempt to detect hallucinations/malformed games and auto regenerate. *Hallucinations will slip through*.

# Set up

Install [rust toolchain](https://www.rust-lang.org/learn/get-started) and [ollama](https://ollama.com/) with your choice of ollama LLM model. Ollama is not required for running archive games.

    cd ./back
    cargo build
    // skip arg for archive games
    cargo run -- model_name

In another terminal:

    cd ../front
    npm install
    npm run dev

Open in your browser:

    http://localhost:5173/
