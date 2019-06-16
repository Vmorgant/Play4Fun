
export function wait(ms){
  let start = new Date().getTime();
  let end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
}
export function removeTabBar() {
  let tabs = document.querySelectorAll('.show-tabbar');
  if (tabs !== null) {
    Object.keys(tabs).map((key) => {
      tabs[key].style.display = 'none';
    });
  }
}

export function putTabBar(){
  let tabs = document.querySelectorAll('.show-tabbar');
  Object.keys(tabs).map((key) => {
    tabs[key].style.display = 'flex';
  });
}
