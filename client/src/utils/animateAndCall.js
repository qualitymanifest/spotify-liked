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
  const res = await func(); // variables are bound
  removeExistingClassInstances(loadingClass);
  if (res.status === 200) {
    el.classList.add(doneClass);
  }
  return res;
};

export default animateAndCall;
