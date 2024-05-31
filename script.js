document.addEventListener('DOMContentLoaded', () => {
    fetch('data/knives.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const knivesData = data.knives;
            const knifeList = document.getElementById('knife-list');

            knivesData.forEach(knife => {
                const knifeItem = document.createElement('div');
                knifeItem.className = 'knife-item';

                knifeItem.innerHTML = `
                    <img src="${knife.image}" alt="${knife.name}">
                    <h2>${knife.name}</h2>
                    <p>${knife.description}</p>
                    <p id="price-${knife.id}">Price: $${knife.price.toFixed(2)}</p>
                    <label for="quantity-${knife.id}">Quantity: </label>
                    <input type="number" id="quantity-${knife.id}" name="quantity-${knife.id}" min="1" value="1">
                    <div id="paypal-button-container-${knife.id}" class="buy-now"></div>
                `;

                knifeList.appendChild(knifeItem);

                document.getElementById(`quantity-${knife.id}`).addEventListener('input', (event) => {
                    const quantity = event.target.value;
                    const totalPrice = knife.price * quantity;
                    document.getElementById(`price-${knife.id}`).textContent = `Price: $${totalPrice.toFixed(2)}`;
                });

                paypal.Buttons({
                    createOrder: function(data, actions) {
                        const quantity = document.getElementById(`quantity-${knife.id}`).value;
                        const total = knife.price * quantity;
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: total.toFixed(2),
                                    breakdown: {
                                        item_total: { value: total.toFixed(2), currency_code: 'USD' }
                                    }
                                },
                                items: [{
                                    name: knife.name,
                                    unit_amount: { value: knife.price.toFixed(2), currency_code: 'USD' },
                                    quantity: quantity
                                }]
                            }]
                        });
                    },
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(function(details) {
                            alert('Transaction completed by ' + details.payer.name.given_name);
                        });
                    }
                }).render(`#paypal-button-container-${knife.id}`);
            });
        })
        .catch(error => {
            console.error('Error fetching knife data:', error);
        });
});