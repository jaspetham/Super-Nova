const header = document.querySelector('header');

window.addEventListener('scroll', function(){
    const scroll = window.pageYOffset;
    if(scroll > 150){
        header.classList.add('header-change');
    }else{
        header.classList.remove('header-change');
    }
})