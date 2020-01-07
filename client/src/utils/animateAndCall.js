const removeExistingClassInstances = className => {
  Array.from(document.getElementsByClassName(className)).forEach(el =>
    el.classList.remove(className)
  );
};

const animateAndCall = async (el, func, loadingClass, doneClass) => {
  // Need to remove existing done classes first, otherwise if
  // clicking on the same thing the loadingClass can't take effect
  removeExistingClassInstances(doneClass);
  el.classList.add(loadingClass);
  await func(); // variables are bound
  removeExistingClassInstances(loadingClass);
  el.classList.add(doneClass);
};

export default animateAndCall;
