let proteinBar, carbBar;

document.addEventListener("DOMContentLoaded", function() {
    // JavaScript code here
    proteinBar = new ProgressBar.Circle('#proteinProgress', {
        color: '#FF5733',
        trailColor: '#f4f4f4',
        strokeWidth: 15,
        duration: 1400,
        from: { color: '#FF5733' },
        to: { color: '#FF5733' },
        step: (state, circle) => {
            circle.path.setAttribute('stroke', state.color);
        }
    });

    carbBar = new ProgressBar.Circle('#carbProgress', {
        color: '#33FF57',
        trailColor: '#f4f4f4',
        strokeWidth: 15,
        duration: 1400,
        from: { color: '#33FF57' },
        to: { color: '#33FF57' },
        step: (state, circle) => {
            circle.path.setAttribute('stroke', state.color);
        }
    });
});

async function getNutrition() {
    // JavaScript code here
    const appId = 'ee42c09b'; // Replace with your actual app ID
    const appKey = '2399082a0a42627d8cbd38db642448c2'; // Replace with your actual app key
    const ingredient = document.getElementById('ingredientInput').value; // Changed to 'ingredientInput'

    const url = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${ingredient}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.calories) {
            displayNutrition(data, ingredient);
            document.getElementById('result').classList.remove('hidden');
            document.getElementById('error').classList.add('hidden');
             // Scroll to the result
             document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
        } else {
            document.getElementById('result').classList.add('hidden');
            document.getElementById('error').classList.remove('hidden');
            document.getElementById('error').innerText = `No nutrition information found for ${ingredient}.`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').innerText = 'An error occurred while fetching nutrition information.';
    }
}

function displayNutrition(data, ingredient) {
    // JavaScript code here
    const nutritionLabels = document.getElementById('nutritionLabels');
    nutritionLabels.innerHTML = `<span class="dot bg-warning"></span> ${ingredient}`;

    const nutritionData = {
        labels: ['Calories', 'Total Fat', 'Carbohydrates', 'Protein', 'Sodium', 'Fiber', 'Sugars'],
        datasets: [{
            label: 'Nutritional Information',
            data: [
                data.calories,
                data.totalNutrients.FAT ? data.totalNutrients.FAT.quantity.toFixed(2) : 0,
                data.totalNutrients.CHOCDF ? data.totalNutrients.CHOCDF.quantity.toFixed(2) : 0,
                data.totalNutrients.PROCNT ? data.totalNutrients.PROCNT.quantity.toFixed(2) : 0,
                data.totalNutrients.NA ? data.totalNutrients.NA.quantity.toFixed(2) : 0,
                data.totalNutrients.FIBTG ? data.totalNutrients.FIBTG.quantity.toFixed(2) : 0,
                data.totalNutrients.SUGAR ? data.totalNutrients.SUGAR.quantity.toFixed(2) : 0
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(199, 199, 199, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)'
            ],
            borderWidth: 1
        }]
    };

    const ctx = document.getElementById('nutritionChart').getContext('2d');
    // Destroy existing chart instance if it exists
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: nutritionData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Update the circular progress bars
    const proteinValue = data.totalNutrients.PROCNT ? data.totalNutrients.PROCNT.quantity.toFixed(2) : 0;
    const carbValue = data.totalNutrients.CHOCDF ? data.totalNutrients.CHOCDF.quantity.toFixed(2) : 0;

    proteinBar.animate(proteinValue / 100); // Assuming max value for protein is 100g
    carbBar.animate(carbValue / 100); // Assuming max value for carbohydrates is 100g

    document.getElementById('proteinLabel').innerText = `Protein: ${proteinValue}g`;
    document.getElementById('carbLabel').innerText = `Carbohydrates: ${carbValue}g`;
}
