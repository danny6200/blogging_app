function readingTime(blog){
    const words = blog.split(" ")
    const count = words.length
    const time = Math.round(count / 200);
    return time;
}







module.exports = {
    readingTime
}