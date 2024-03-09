fn sq_in_rect(lng: i32, wdth: i32) -> Option<Vec<i32>> {
    if lng == wdth {
        return None;
    }

    let mut res = Vec::new();

    let mut length = lng;
    let mut width = wdth;

    while length > 0 && width > 0 {
        if length > width {
            res.push(width);
            length -= width;
        } else {
            res.push(length);
            width -= length;
        }
    }

    Some(res)
}
