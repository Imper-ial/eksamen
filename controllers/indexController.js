// controller for forsiden
exports.showHome = (req, res) => {
  res.render('index', { title: 'Kommune 69 Varslingssystem' });
};
