if (typeof jQuery === 'undefined') {
    document.write('<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>');
}
document.write('<link rel="stylesheet" href="css/jquery.puroadver.css" />');
document.write('<script src="js/puropela.plugins.js"></script>');
document.write('<script src="js/jquery.puroadver.js"></script>');

function PuroadverRun(e) {
    var puro = $(e).puroadver({
        url: 'data.json'
    });
}