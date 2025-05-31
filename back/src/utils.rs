use std::env;

pub fn get_args() -> Option<String> {
    let args: Vec<String> = env::args().collect();
    let opt = args.get(1)?;
    return Some(opt.to_owned());
}
