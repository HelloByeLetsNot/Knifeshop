document.addEventListener('DOMContentLoaded', () => {
    fetch('data/services.json')
        .then(response => response.json())
        .then(data => {
            const servicesData = data.services;
            const serviceList = document.getElementById('service-list');

            servicesData.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'service-item';

                serviceItem.innerHTML = `
                    <h2>${service.name}</h2>
                    <div class="before-after">
                        <img src="${service.beforeImage}" alt="Before ${service.name}">
                        <img src="${service.afterImage}" alt="After ${service.name}">
                    </div>
                    <p id="price-service-${service.id}">Price: $${service.price.toFixed(2)}</p>
                    <label for="quantity-service-${service.id}">Quantity: </label>
                    <input type="number" id="quantity-service-${service.id}" name="quantity-service-${service.id}" min="1" value="1">
                    <div id="paypal-button-container-service-${service.id}" class="buy-now"></div>
                `;

                serviceList.appendChild(serviceItem);

                                document.getElementById(`quantity-service-${service.id}`).addEventListener('input', (event) => {
                                    const quantity = event.target.value;
                                    const totalPrice = service.price * quantity;
                                    document.getElementById(`price-service-${service.id}`).textContent = `Price: $${totalPrice.toFixed(2)}`;
                                });

                                paypal.Buttons({
                                    createOrder: function(data, actions) {
                                        const quantity = document.getElementById(`quantity-service-${service.id}`).value;
                                        const total = service.price * quantity;
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: total.toFixed(2),
                                                    breakdown: {
                                                        item_total: { value: total.toFixed(2), currency_code: 'USD' }
                                                    }
                                                },
                                                items: [{
                                                    name: service.name,
                                                    unit_amount: { value: service.price.toFixed(2), currency_code: 'USD' },
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
                                }).render(`#paypal-button-container-service-${service.id}`);
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching services data:', error);
                        });
                });