exports.getExpenses = (req,where) =>{
    return req.user.getExpenses(where)
}

exports.createDownloadHistory = (req,data) =>{
    console.log(req);
    return req.user.createDownload({url: data})
}

exports.getDownloadHistory = (req,where) =>{
    return req.user.getDownloads(where)
}