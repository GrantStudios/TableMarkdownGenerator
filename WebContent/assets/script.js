const resultArea = $('#result');
function update() {
    resultArea.text(generateMarkdown());
}

$(document).on('input', 'td', function () {
    update();
})

$('.table-add-column').on('click', function () {
    $('tr').append('<td contenteditable></td>');
    update();
})

$('.table-add-row').on('click', function () {
    $('table tbody').append('<tr>' + '<td contenteditable></td>'.repeat($('tr').first().find('td').length) + '</tr>');
    update();
})

$('.table-remove-column').on('click', function () {
    $('tr td:last-child').remove();
    update();
})

$('.table-remove-row').on('click', function () {
    $('tr').last().remove();
    update();
})

const linebreaksCheckbox = $('#preserve-linebreaks');

const options = {
    preserve_linebreaks: true
}

$('.option input').on('change', function () {
    let prop = $(this).attr('data-prop');
    options[prop] = !options[prop];
    update();
})

function getCellContent(cell) {
    let content = cell.innerText;
    content = content.replaceAll('\n', options.preserve_linebreaks ? '<br>' : '');
    return content;
}

function generateMarkdown() {
    let rows = $('tr');
    let lengths = $.map(rows.first().find('td'), (e, i) => getLengthOfColumnIndex(i));
    let headings = $.map($('tr').first().find('td'), (elem, i) => getCellContent(elem).padEnd(lengths[i]));
    let headingDivider = '|' + headings.map(e => '-'.repeat(e.length + 2)).join('|') + '|';
    return '| ' + headings.join(' | ') +
        ' |\n' + headingDivider + '\n'
        + $.map(rows.slice(1), function (elem) {
            return '| ' + $.map($(elem).find('td'), function (elem, i) {
                return getCellContent(elem).padEnd(lengths[i]);
            }).join(' | ') + ' |';
        }).join('\n');
}

function getLengthOfColumnIndex(index) {
    return $('td:nth-child(' + (index + 1) + ')').toArray().reduce((a, b) => {
        let len = getCellContent(b).length;
        if (len > a) a = len;
        return a;
    }, 0)
}

let lastCopyTimeout;
let copyButton = $('#copybutton');

let initialContent = copyButton.html();

copyButton.on('click', function(){
    copyToClipboard(resultArea.text());
    copyButton.text('Copied!');
    clearTimeout(lastCopyTimeout);
    lastCopyTimeout = setTimeout(function(){
        copyButton.html(initialContent);
    }, 1000);
})

function copyToClipboard(text) {
    let t = document.createElement('textarea');
    t.innerHTML = text;
    document.body.appendChild(t);
    t.select();
    let res = document.execCommand('copy');
    document.body.removeChild(t);
    return res;
}

const optionToggle = $('#options');
const optionsContainer = $('.options');
let optionsExpanded = false;
optionToggle.on('click', function(e){
    optionsContainer.slideDown('fast');
    optionsExpanded = true;
    e.stopPropagation();
})

$(document).on('click', function(e){
    console.log(e.target);
    if(optionsExpanded && !$.contains(optionsContainer, e.target)){
        optionsContainer.slideUp('fast');
        optionsExpanded = false;
    }
})