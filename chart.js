document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('mangroveChart').getContext('2d');

    const mangroveDataByRegion = {
        bali: [5000, 4875, 4753, 4625, 4502, 4380, 4258, 4132, 4005, 3879, 3750, 3628, 3507, 3382, 3264, 3145, 3020, 2901, 2786, 2664, 2549, 2430, 2318, 2203, 2143],
    jakarta: [100, 95, 91, 88, 85, 81, 78, 75, 72, 70, 67, 65, 63, 61, 59, 58, 56, 54, 53, 51, 50, 48, 47, 65, 63],
    sumatera_selatan: [500000, 482350, 465672, 450098, 435692, 420781, 405634, 391250, 376984, 362098, 345990, 332078, 318563, 306751, 294112, 282345, 270234, 258501, 247382, 235986, 225604, 214389, 204500, 195000, 186200]
};

    const mangroveOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Area (ha)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year'
                }
            }
        }
    };

    const mangroveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                '2000', '2001', '2002', '2003', '2004', '2005', 
                '2006', '2007', '2008', '2009', '2010', '2011', 
                '2012', '2013', '2014', '2015', '2016', '2017', 
                '2018', '2019', '2020', '2021', '2022', '2023', 
                '2024'
            ],
            datasets: [{
                label: 'Luasan Mangrove di Bali (ha)',
                data: mangroveDataByRegion.bali,
                backgroundColor: 'rgba(33, 224, 90, 0.5)',
                borderColor: 'rgba(33, 224, 90, 1)',
                borderWidth: 2
            }]
        },
        options: mangroveOptions
    });

    document.getElementById('mangroveChart').style.display = 'none';

    window.updateChart = function() {
        const locationSelect = document.getElementById('locationSelect');
        const selectedOption = locationSelect.options[locationSelect.selectedIndex];
        const regionKey = selectedOption.getAttribute('data-region');

        if (regionKey) {
            document.getElementById('mangroveChart').style.display = 'block';

            mangroveChart.data.datasets[0].data = mangroveDataByRegion[regionKey];
            mangroveChart.data.datasets[0].label = `Mangrove Area in ${regionKey.replace('_', ' ').charAt(0).toUpperCase() + regionKey.slice(1).replace('_', ' ')} (ha)`;
            mangroveChart.update();
        } else {
            document.getElementById('mangroveChart').style.display = 'none';
        }
    };
});

document.getElementById('locationSelect').addEventListener('change', updateChart);
