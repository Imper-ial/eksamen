// controller for forsiden
exports.showHome = (req, res) => {
  res.render('index', { title: 'Kommune 69 Varslingssystem' });
};

// controller for dashboard (beskyttet side)
exports.showDashboard = (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
};
