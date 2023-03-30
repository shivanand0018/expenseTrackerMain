exports.getExpenses = (req,where) =>{
    return req.user.getExpenses(where)
}

exports.createDownloadHistory = (req,data) =>{
    return req.user.createDownload({url: data})
}

exports.getDownloadHistory = (req,where) =>{
    return req.user.getDownloads(where)
}