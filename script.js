const header = document.querySelector('header');
const mainContent = document.getElementById('mainContent');

window.addEventListener('scroll', function(){
    const scroll = window.pageYOffset;
    if(scroll > 150){
        header.classList.add('header-change');
    }else{
        header.classList.remove('header-change');
    }
})
mainContent.style.setProperty('top',`calc(100vh - ${header.offsetHeight}px)`);

window.addEventListener('resize', function(){
    mainContent.style.setProperty('top',`calc(100vh - ${header.offsetHeight}px)`);
})

const plans = document.querySelectorAll('.plan-btn');
const planPill = document.getElementById('plan-pill');

plans.forEach((plan) =>{
    plan.addEventListener('click', (e) =>{
        setPlan(plan)
    })
})

const details = document.querySelectorAll('.plan-details .detail');

details.forEach((detail) =>{
    detail.addEventListener('click', (e) =>{
        setPlan(detail)
    })
})

const accordions = document.querySelectorAll('.accordion-item');

accordions.forEach((item)=>{
    item.addEventListener('click',function(){
        accordions.forEach((x) => {
            x.classList.remove('active');
        })
        if(item.classList.contains('active')){
            item.classList.remove('active');
        }else{
            item.classList.add('active');
        }
    })
})

function setPlan(target){
    removePlanActive();
    var planId = target.getAttribute('plan-id');
    addPlanActive(planId);
    // move pill
    switch(planId){
        case '1':
            movePlanPill('first');
            break;
        case '2':
            movePlanPill('second');            
            break;
        case '3':
            movePlanPill('third');            
            break;
    }
}

function removePlanActive(){
    planPill.removeAttribute('class');
    plans.forEach((plan) =>{
        plan.classList.remove('active');
    })
    details.forEach((detail) =>{
        detail.classList.remove('active');
    })
}

function addPlanActive(id){
    document.getElementById(`plan-${id}`).classList.add('active');
    document.getElementById(`detail-${id}`).classList.add('active');
}
function movePlanPill(val){
    planPill.classList.add(val);
}

const mobileNav = document.querySelector('.mobile-nav-toggle');
const srOnly = document.querySelector('.sr-only');
const mainNav = document.querySelector('.primary-navigation');

mobileNav.addEventListener('click',function(){
    var state = this.getAttribute('aria-expanded');
    if(state == 'true'){
        this.setAttribute('aria-expanded','false');
        srOnly.setAttribute('aria-expanded','false');
        mainNav.setAttribute('data-visible','false');
    }else{
        this.setAttribute('aria-expanded','true');
        srOnly.setAttribute('aria-expanded','true');
        mainNav.setAttribute('data-visible','true');
    }
})