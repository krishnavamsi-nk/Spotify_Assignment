document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/songs');
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();

    let filteredData = data; 
    const songNames = filteredData.map(song => song.name);
    const popularity = filteredData.map(song => song.popularity);

    // Bar Chart
    const barChart = new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: songNames,
        datasets: [{
          label: 'Popularity',
          data: popularity,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Line Chart
    const lineChart = new Chart(document.getElementById('lineChart'), {
      type: 'line',
      data: {
        labels: songNames,
        datasets: [{
          label: 'Popularity',
          data: popularity,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Pie Chart
    const pieChart = new Chart(document.getElementById('pieChart'), {
      type: 'pie',
      data: {
        labels: songNames,
        datasets: [{
          label: 'Popularity',
          data: popularity,
          backgroundColor: data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`),
          borderColor: data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
          borderWidth: 1
        }]
      },
      options: {}
    });

    
    document.getElementById('filterPopularity').addEventListener('change', (event) => {
      const selectedRange = event.target.value;
      filteredData = data.filter(song => {
        const songPopularity = song.popularity;
        switch (selectedRange) {
          case '0-20':
            return songPopularity >= 0 && songPopularity <= 20;
          case '21-40':
            return songPopularity >= 21 && songPopularity <= 40;
          case '41-60':
            return songPopularity >= 41 && songPopularity <= 60;
          case '61-80':
            return songPopularity >= 61 && songPopularity <= 80;
          case '81-100':
            return songPopularity >= 81 && songPopularity <= 100;
          default:
            return true;
        }
      });

      // Update charts with filtered data
      const filteredSongNames = filteredData.map(song => song.name);
      const filteredPopularity = filteredData.map(song => song.popularity);

      barChart.data.labels = filteredSongNames;
      barChart.data.datasets[0].data = filteredPopularity;
      barChart.update();

      lineChart.data.labels = filteredSongNames;
      lineChart.data.datasets[0].data = filteredPopularity;
      lineChart.update();

      pieChart.data.labels = filteredSongNames;
      pieChart.data.datasets[0].data = filteredPopularity;
      pieChart.update();
    });

  } catch (error) {
    console.error(error);
    document.body.innerHTML = '<p>Failed to load data. Please try again later.</p>';
  }
});
