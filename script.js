const btn = document.querySelector("#btn");
const btn1 = document.querySelector("#btn1");
const login_nav = document.querySelector("#btn2");
const login_nav1 = document.querySelector("#btn3");
const modal = document.querySelector(".modal1");
const overlay = document.querySelector(".overlay");
const btncloseRegister = document.querySelector(".btn--close-modal-register");
const btncloseLogin = document.querySelector(".btn--close-modal-login");
const nameRegister = document.querySelector("#nameRegister");
const emailRegister = document.querySelector("#emailRegister");
const passwordRegister = document.querySelector("#passwordRegister");
const emailLogin = document.querySelector("#emailLogin");
const passwordLogin = document.querySelector("#passwordLogin");
const register = document.querySelector("#register");
const login = document.querySelector(".login");
const loginBtn = document.querySelector("#loginBtn");
const chestCard = document.querySelector("#chest");

chestCard.addEventListener("click", function () {
  console.log("Clicked");
});
function register_page_display(e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}
btn.addEventListener("click", function (e) {
  register_page_display(e);
});
btn1.addEventListener("click", function (e) {
  register_page_display(e);
});
login_nav.addEventListener("click", function (e) {
  login.classList.remove("hidden");
  overlay.classList.remove("hidden");
  modal.classList.add("hidden");
  e.preventDefault();
});
login_nav1.addEventListener("click", function (e) {
  login.classList.remove("hidden");
  overlay.classList.remove("hidden");
  modal.classList.add("hidden");
  e.preventDefault();
});
btncloseRegister.addEventListener("click", function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});
btncloseLogin.addEventListener("click", function () {
  console.log("closed");
  login.classList.add("hidden");
  overlay.classList.add("hidden");
});
overlay.addEventListener("click", function () {
  console.log("overlay");
  login.classList.add("hidden");
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});
register.addEventListener("click", function (e) {
  e.preventDefault();
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  console.log(nameRegister.value);
  console.log(passwordRegister.value);
  console.log(emailRegister.value);
  if (
    nameRegister.value != "" ||
    passwordRegister.value != "" ||
    emailRegister.value != ""
  )
    alert("Successfully Registered, Thank You!!");
  else alert("Fields cannot be empty");
});
function alert_display(text) {
  const alert_text = document.querySelector(".alert_text");
  alert_text.innerHTML = text;
}

//login         modal opening button

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  login.classList.remove("hidden");
  overlay.classList.remove("hidden");
  console.log(emailLogin.value);
  console.log(passwordLogin.value);
  if (passwordLogin.value != "" || emailLogin.value != "")
    alert("Successfully Logged In!!");
  else alert("Fields cannot be empty");
});
// //smooth scrolling
const allSections = document.querySelectorAll(".section");
console.log(allSections);
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  console.log("scrolling");
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

/**************************  BMI CALCULATOR START *****************************************/
const age = document.getElementById("staticAge");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const calculate_btn = document.getElementById("calculate-btn");
const bmi_result = document.querySelector(".bmi_result");
const alert_bmi = document.querySelector("#alert_bmi");

//*************ALERT BUTTON */
const alert_btn = document.getElementById("alert_btn");
alert_btn.addEventListener("click", function () {
  alert_bmi.classList.add("hidden");
});

function calculate_bmi(weight, height) {
  if (typeof weight === "NAN" || typeof height == "NAN") {
    alert_bmi.classList.remove("hidden");
    alert_display("Weight or Height cannot be alpabets");
    return;
  }
  console.log(typeof weight);
  let heightInMeter = height / 100;
  let bmi = weight / (heightInMeter * heightInMeter);
  console.log(bmi);
  bmi = bmi.toFixed(2);
  bmi_result.classList.remove("hidden");
  var para;
  if (bmi < 17) {
    para = "you're unhealthy";
    bmi_result.style.color = "red";
  }
  if (bmi < 24 && bmi > 17) {
    para = "you're healthy";
    bmi_result.style.color = "green";
  }
  if (bmi > 24) {
    para = "you have obesity";
    bmi_result.style.color = "brown";
  }

  bmi_result.innerHTML = "Your BMI value is" + ` ${bmi}` + " , " + para;
}
calculate_btn.addEventListener("click", function () {
  console.log(typeof weight.value, typeof height.value);
  calculate_bmi(parseInt(weight.value), parseInt(height.value));
});

/*****************************************BMI CALCULATOR ENDS *************************************/

/*****************************************CALORIMETER STARTS *************************************/
const age_calorie = document.getElementById("age_cal");
const weight_calorie = document.getElementById("weight_cal");
const height_calorie = document.getElementById("height_cal");
const calculate_calorie_btn = document.getElementById("calculate-calorie");
const radioButtons = document.querySelectorAll('input[name="gender"]');
const bmr_result = document.querySelector(".bmr_result");
const scheduler_link = document.getElementById("scheduler_link");

function BMR_result_display(bmr) {
  bmr_result.classList.remove("hidden");
  bmr_result.innerHTML = "You need to consume " + bmr.toFixed(0) + "Kcal daily";
  scheduler_link.classList.remove("hidden");
}

scheduler_link.addEventListener("click", function (e) {
  register_page_display(e);
});
calculate_calorie_btn.addEventListener("click", function () {
  let selectedSize, BMR;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedSize = radioButton.value;
      break;
    }
  }
  if (selectedSize === "female") {
    BMR =
      655.1 +
      9.563 * weight_calorie.value +
      1.85 * height_calorie.value -
      4.676 * age_calorie.value;
    console.log(BMR);
  }
  if (selectedSize === "male") {
    BMR =
      66.5 +
      13.75 * weight_calorie.value +
      5.003 * height_calorie.value -
      6.75 * age_calorie.value;
    console.log(BMR);
  }
  BMR_result_display(BMR);
});

// For women – BMR = 655.1 + (9.563 * weight in kg) + (1.850 * height in cm) - (4.676 * age) .
//  For men – BMR = 66.5 + (13.75 * weight in kg) + (5.003 * height in cm) - (6.75 * age)

const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
