function step1(cb) {
  setTimeout(() => {
    console.log("Step 1 done");
    cb();
  }, 1000);
}

function step2(cb) {
  setTimeout(() => {
    console.log("Step 2 done");
    cb();
  }, 1000);
}

function step3(cb) {
  setTimeout(() => {
    console.log("Step 3 done");
    cb();
  }, 1000);
}

// Callback Hell
step1(function () {
  step2(function () {
    step3(function () {
      console.log("All steps completed");
    });
  });
});
