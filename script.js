// --- Utility Functions ---

/**
 * Wraps long labels for better display on chart axes.
 * @param {Array<string>} labels - Array of label strings.
 * @returns {Array<string|Array<string>>} - Array of labels, with long labels split into arrays.
 */
function wrapLabels(labels) {
    return labels.map(label => {
        if (label.length > 16) {
            const words = label.split(' ');
            const lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                // Check if adding the next word exceeds max length
                if (currentLine.length + 1 + words[i].length <= 16) {
                    currentLine += ' ' + words[i];
                } else {
                    lines.push(currentLine);
                    currentLine = words[i];
                }
            }
            lines.push(currentLine);
            return lines;
        }
        return label;
    });
}

// Shared Tooltip Configuration for Chart.js
const sharedTooltipConfig = {
    callbacks: {
        title: function(tooltipItems) {
            const item = tooltipItems[0];
            let label = item.chart.data.labels[item.dataIndex];
            // If the label was wrapped, join the array back into a single string for the tooltip title
            if (Array.isArray(label)) {
                return label.join(' ');
            } else {
                return label;
            }
        }
    }
};

// --- Export Functionality (Uses html2canvas) ---
document.getElementById('exportBtn').addEventListener('click', exportAsPng);

function exportAsPng() {
    const element = document.body;

    // Hide elements that should not appear in the static PNG capture
    const header = document.querySelector('header');
    const exportButton = document.getElementById('exportBtn');
    
    if (header) header.style.display = 'none';
    // Temporarily hide the parent flex container to only hide the export button itself
    if (exportButton) exportButton.style.display = 'none';

    // Use html2canvas to capture the body content
    html2canvas(element, { 
        // Capture from the top of the page, regardless of scroll position
        scrollY: -window.scrollY,
        // Ensure the entire document height is captured
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.scrollHeight,
        scale: 2 // Higher scale for better resolution
    }).then(canvas => {
        // Restore hidden elements after capture
        if (header) header.style.display = 'flex';
        if (exportButton) exportButton.style.display = 'inline-block';

        // Trigger download
        const link = document.createElement('a');
        link.download = 'quantum_infographic.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('Error generating PNG:', error);
        // Restore hidden elements on error, too
        if (header) header.style.display = 'flex';
        if (exportButton) exportButton.style.display = 'inline-block';
    });
}


// --- Chart Initializations ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Scaling Chart (Line Chart)
    const ctxScaling = document.getElementById('scalingChart').getContext('2d');
    new Chart(ctxScaling, {
        type: 'line',
        data: {
            labels: ['1 Unit', '2 Units', '3 Units', '4 Units', '5 Units', '6 Units'],
            datasets: [{
                label: 'Quantum Power (2^N)',
                data: [2, 4, 8, 16, 32, 64],
                borderColor: '#F72585',
                backgroundColor: 'rgba(247, 37, 133, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            },
            {
                label: 'Classical Power (Linear)',
                data: [1, 2, 3, 4, 5, 6],
                borderColor: '#4361EE',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: sharedTooltipConfig
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Simultaneous States' }
                }
            }
        }
    });

    // 2. Impact Radar Chart
    const ctxRadar = document.getElementById('impactRadar').getContext('2d');
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: wrapLabels([
                'Cryptography Security', 
                'Drug Discovery', 
                'Financial Modeling', 
                'Traffic Optimization', 
                'AI Training Speed',
                'Material Science'
            ]),
            datasets: [{
                label: 'Disruption Potential (0-100)',
                data: [95, 90, 80, 75, 85, 88],
                backgroundColor: 'rgba(114, 9, 183, 0.2)',
                borderColor: '#7209B7',
                pointBackgroundColor: '#F72585',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#F72585'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: sharedTooltipConfig
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    pointLabels: {
                        font: { size: 11, family: 'Roboto' },
                        color: '#4B5563'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    // 3. Temperature Chart (Horizontal Bar)
    const ctxTemp = document.getElementById('tempChart').getContext('2d');
    new Chart(ctxTemp, {
        type: 'bar',
        data: {
            labels: wrapLabels(['Deep Space', 'Liquid Nitrogen', 'Dry Ice', 'Room Temp', 'Quantum Chip']),
            datasets: [{
                label: 'Temperature (Kelvin)',
                data: [2.7, 77, 194, 293, 0.015],
                backgroundColor: [
                    '#4361EE',
                    '#4CC9F0',
                    '#B5179E',
                    '#F72585',
                    '#3A0CA3'
                ],
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: sharedTooltipConfig
            },
            scales: {
                x: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Kelvin (Log Scale)' },
                    grid: { display: false }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
});
