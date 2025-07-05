const chartInfo = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000, 80000]
}

export const dashboardPage = (req, res) => {
    res.render('admin/home.hbs', {
        layout: 'admin',
        active: 'dashboard',
        chart: true,
        chartInfo: JSON.stringify(chartInfo)
    })
}