const removeExistingClassInstances = className => {
  Array.from(document.getElementsByClassName(className)).forEach(el =>
    el.classList.remove(className)
  );
};

const animateAndCall = async (el, func, loadingClass, doneClass) => {
  el.classList.add(loadingClass);
  await func(); // variables are bound
  removeExistingClassInstances(doneClass);
  removeExistingClassInstances(loadingClass);
  el.classList.add(doneClass);
};

export default animateAndCall;
