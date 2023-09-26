const calcDate = (m) => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let days = 0;

    if (m > 0) {
      for (let i = 0; i < m; i++) {
        month += 1;
        if (month > 12) {
          year += 1;
          month = 1;
        }
        days += new Date(year, month, 0).getDate();
      }
    } else {
      for (let i = m; i < 0; i++) {
        month -= 1;
        if (month < 1) {
          year -= 1;
          month = 12;
        }
        days -= new Date(year, month, 0).getDate();
      }
    }

    const newTime = date.getTime() + 3600 * 24 * 1000 * days;
    return new Date(newTime);
};


module.exports = calcDate