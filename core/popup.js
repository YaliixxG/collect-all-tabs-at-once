let collectTabs = document.querySelector('#ct-collect-tabs');
let openTabs = document.querySelector('#ct-open-tabs');
let clearTabs = document.querySelector('#ct-clear-tabs');
let checkHistoryTabs = document.querySelector('#ct-check-history-tabs');
let historyTabs = document.querySelector('#ct-history-tabs');
let darkScheme = document.querySelector('.ct-dark-scheme');
let lightScheme = document.querySelector('.ct-light-scheme');
let tabGroups = [];

chrome.storage.sync
    .get(['tabGroups'])
    .then(res => (tabGroups = res.tabGroups || []));

// 一键收集
collectTabs.addEventListener('click', async () => {
    let isStack = !!tabGroups.length
        ? confirm('是否在已收集的标签基础上继续收集？')
        : false;

    await oneBtnCollect(isStack);
    alert('标签收集成功 ~ (*^▽^*)');
});

// 一键打开
openTabs.addEventListener('click', () => {
    oneBtnOpen();
});

// 一键清空
clearTabs.addEventListener('click', () => {
    oneBtnClear();
    alert('标签清空成功 ~ (*^▽^*)');
});

// 查看已收集
checkHistoryTabs.addEventListener('click', () => {
    renderHistoryTabs();
});

const oneBtnCollect = isStack => {
    !isStack && oneBtnClear();
    chrome.tabs.query({}, tabs => {
        tabs.forEach(item => {
            tabGroups.push({
                title: item.title,
                url: item.url
            });
            chrome.storage.sync.set({ tabGroups });
        });
    });
};

const oneBtnOpen = () => {
    tabGroups.forEach(item =>
        chrome.tabs.create({
            url: item.url
        })
    );
};

const oneBtnClear = () => {
    tabGroups = [];
    chrome.storage.sync.remove('tabGroups');
};

const renderHistoryTabs = () => {
    if (!!!tabGroups.length) {
        alert('没有数据哦，去一键收集吧 ~ (*╹▽╹*)');
    }
    historyTabs.innerHTML = '';
    tabGroups.forEach(item => {
        historyTabs.innerHTML += `<li>${item.title}</li>`;
    });
};

// 监听数据变化
chrome.storage.onChanged.addListener(function(changes, namespace) {
    renderHistoryTabs();
});

darkScheme.addEventListener('click', () => {
    lightScheme.style.display = 'block';
    darkScheme.style.display = 'none';
    document.body.style.color = '#333';
    document.body.style.backgroundColor = '#fff';
});

lightScheme.addEventListener('click', () => {
    lightScheme.style.display = 'none';
    darkScheme.style.display = 'block';
    document.body.style.color = '#fff';
    document.body.style.backgroundColor = 'rgb(60, 60, 60)';
});
