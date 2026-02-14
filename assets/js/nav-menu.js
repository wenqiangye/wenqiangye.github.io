/**
 * 导航栏汉堡菜单 - 手机响应式菜单
 */
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.greedy-nav > button');
  const hiddenLinks = document.querySelector('.hidden-links');
  
  if (!navToggle || !hiddenLinks) return;

  // 切换菜单
  navToggle.addEventListener('click', function(e) {
    e.preventDefault();
    navToggle.classList.toggle('is-active');
    hiddenLinks.classList.toggle('open');
  });

  // 点击菜单项时关闭菜单
  const hiddenLinksItems = hiddenLinks.querySelectorAll('a');
  hiddenLinksItems.forEach(item => {
    item.addEventListener('click', function() {
      navToggle.classList.remove('is-active');
      hiddenLinks.classList.remove('open');
    });
  });

  // 点击页面其他地方时关闭菜单
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.greedy-nav')) {
      navToggle.classList.remove('is-active');
      hiddenLinks.classList.remove('open');
    }
  });
});