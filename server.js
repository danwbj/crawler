var http = require('http')
var cheerio = require('cheerio')

var url = 'http://www.imooc.com/learn/348'
http.get(url, (res) => {
    var html = ''
    res.on('data', (data) => {
        html += data
    })
    res.on('end', () => {
        var courseData = filterChapters(html)
        printChapter(courseData)
    })
}).on('error', () => {
    console.log('获取课程信息出错')
})
function filterChapters(html) {
    var $ = cheerio.load(html)
    var chapters = $('.chapter')
    var courseData = []
    chapters.each((item) => {
        var chapter = $('.chapter')
        var chapterTitle = chapter.find('strong').text()
        var videos = chapter.find('.video').children('li')
        var chapterData = {
            chapterTitle: chapterTitle,
            videos:[]
        }
        videos.each(item => {
            var video = $('.video').find('.J-media-item')
            var videoTitle = videos.text()
            var id = video.attr('href').split('video/')[0]
            chapterData.videos.push({title:videoTitle,id:id})
        })
        courseData.push(chapterData)
    })
    return courseData
}
function printChapter(courseData) { 
    courseData.forEach(item => {
        var chapterTitle = item.chapterTitle
        item.videos.forEach(video => {
            console.log('  ［'+video.id+']'+video.title)
        })
    })
}