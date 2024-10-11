fn find_average(slice: &[f64]) -> f64 {
    if slice.is_empty() {
        0.0
    } else {
        slice.iter().sum::<f64>() / slice.len() as f64
    }
}

