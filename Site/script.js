document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let currentScreen = 'loginScreen';
    let previousScreen = '';
    let darkMode = false;
    let deviceConnected = false;
    let configPanelOpen = false;
    let chart1, chart2;
    
    // Melhorar o favicon e logo do site para melhor visibilidade
    const updateLogoAndFavicon = () => {
        // Garantir que o favicon está visível e com tamanho adequado
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
            favicon.setAttribute("sizes", "32x32");
        }
        
        // Melhorar o logo do SPARK
        const sparkLogos = document.querySelectorAll('.spark-logo');
        sparkLogos.forEach(logo => {
            logo.style.width = '60px';
            logo.style.height = '60px';
            logo.style.backgroundSize = 'contain';
            logo.style.filter = 'drop-shadow(0 0 3px rgba(0,0,0,0.2))';
        });
    };
    
    // Melhorar o botão de sair com um ícone mais estético
    const updateExitButtons = () => {
        const exitButtons = document.querySelectorAll('.btn-exit');
        exitButtons.forEach(btn => {
            // Remover conteúdo atual
            btn.innerHTML = '';
            
            // Adicionar um novo ícone mais estético
            const icon = document.createElement('i');
            icon.className = 'fas fa-sign-out-alt';
            icon.style.transform = 'rotate(180deg)';
            
            // Adicionar efeitos visuais
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.background = 'linear-gradient(145deg, #B8DBD9, #a5c9c7)';
            btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            
            btn.appendChild(icon);
            
            // Melhorar interação hover
            btn.addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                icon.style.transform = 'rotate(180deg) scale(1.1)';
            });
            
            btn.addEventListener('mouseout', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                icon.style.transform = 'rotate(180deg) scale(1)';
            });
        });
    };
    
    // Funções de navegação entre telas
    function navigateTo(screenId) {
        previousScreen = currentScreen;
        document.getElementById(currentScreen).classList.remove('active');
        document.getElementById(screenId).classList.add('active');
        currentScreen = screenId;
        
        // Inicializar gráficos ao navegar para telas específicas
        if (screenId === 'infoScreen2') {
            initChart1();
        } else if (screenId === 'infoScreen3') {
            initChart2();
        }
        
        updateBackButtons();
    }
    
    // Função para adicionar botões de voltar entre telas de login
    function updateBackButtons() {
        // Remover botões de voltar existentes para evitar duplicação
        const existingBackButtons = document.querySelectorAll('.back-navigation-btn');
        existingBackButtons.forEach(btn => btn.remove());
        
        // Adicionar botões de voltar com base na tela atual
        if (currentScreen === 'registerScreen') {
            addBackButton('registerScreen', 'loginScreen', 'Voltar para Login');
        } else if (currentScreen === 'forgotPasswordScreen') {
            addBackButton('forgotPasswordScreen', 'loginScreen', 'Voltar para Login');
        }
    }
    
    // Função para adicionar botão de voltar a uma tela
    function addBackButton(currentScreenId, targetScreenId, buttonText) {
        const screen = document.getElementById(currentScreenId);
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('back-navigation-btn');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.top = '20px';
        buttonContainer.style.left = '20px';
        buttonContainer.style.zIndex = '100';
        
        const backButton = document.createElement('button');
        backButton.classList.add('btn-back');
        backButton.innerHTML = `<i class="fas fa-arrow-left"></i> ${buttonText}`;
        backButton.style.padding = '8px 15px';
        backButton.style.borderRadius = '20px';
        backButton.style.border = 'none';
        backButton.style.backgroundColor = 'rgba(184, 219, 217, 0.2)';
        backButton.style.color = '#586F7C';
        backButton.style.cursor = 'pointer';
        backButton.style.display = 'flex';
        backButton.style.alignItems = 'center';
        backButton.style.gap = '8px';
        backButton.style.fontSize = '14px';
        backButton.style.transition = 'all 0.3s ease';
        
        backButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(184, 219, 217, 0.4)';
            this.style.transform = 'translateY(-2px)';
        });
        
        backButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(184, 219, 217, 0.2)';
            this.style.transform = 'translateY(0)';
        });
        
        backButton.addEventListener('click', function() {
            navigateTo(targetScreenId);
        });
        
        buttonContainer.appendChild(backButton);
        screen.appendChild(buttonContainer);
    }
    
    // Função para alternar visibilidade de senha
    function togglePasswordVisibility(inputId, toggleElement) {
        const passwordInput = document.getElementById(inputId);
        const icon = toggleElement.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }
    
    // Função para inicializar o gráfico 1
    function initChart1() {
        if (chart1) chart1.destroy();
        
        const ctx = document.createElement('canvas');
        document.getElementById('chartArea').innerHTML = '';
        document.getElementById('chartArea').appendChild(ctx);
        
        const timeLabels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
        const consumptionData = [3.2, 1.8, 2.3, 4.5, 5.2, 4.8, 6.5, 4.2];
        
        chart1 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Consumo kWh',
                    data: consumptionData,
                    backgroundColor: 'rgba(184, 219, 217, 0.2)',
                    borderColor: '#B8DBD9',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: '#586F7C'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: darkMode ? '#ecf0f1' : '#586F7C'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Consumo de Energia ao Longo do Dia',
                        color: darkMode ? '#ecf0f1' : '#586F7C'
                    }
                },
                scales: {
                    x: {
                        ticks: { color: darkMode ? '#ecf0f1' : '#586F7C' },
                        grid: { color: darkMode ? 'rgba(236, 240, 241, 0.1)' : 'rgba(88, 111, 124, 0.1)' }
                    },
                    y: {
                        ticks: { color: darkMode ? '#ecf0f1' : '#586F7C' },
                        grid: { color: darkMode ? 'rgba(236, 240, 241, 0.1)' : 'rgba(88, 111, 124, 0.1)' },
                        title: {
                            display: true,
                            text: 'kWh',
                            color: darkMode ? '#ecf0f1' : '#586F7C'
                        }
                    }
                }
            }
        });
    }
    
    // Função para inicializar o gráfico 2
    function initChart2() {
        if (chart2) chart2.destroy();
        
        const ctx = document.createElement('canvas');
        document.getElementById('chartArea2').innerHTML = '';
        document.getElementById('chartArea2').appendChild(ctx);
        
        const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const costData = [12.5, 15.2, 18.7, 14.3, 16.8, 22.4, 19.6];
        
        chart2 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dayLabels,
                datasets: [{
                    label: 'Custo Diário (R$)',
                    data: costData,
                    backgroundColor: darkMode ? '#86a8a6' : '#B8DBD9',
                    borderColor: darkMode ? '#b0bec5' : '#586F7C',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: darkMode ? '#ecf0f1' : '#586F7C' }
                    },
                    title: {
                        display: true,
                        text: 'Custo Diário de Energia',
                        color: darkMode ? '#ecf0f1' : '#586F7C'
                    }
                },
                scales: {
                    x: {
                        ticks: { color: darkMode ? '#ecf0f1' : '#586F7C' },
                        grid: { color: darkMode ? 'rgba(236, 240, 241, 0.1)' : 'rgba(88, 111, 124, 0.1)' }
                    },
                    y: {
                        ticks: { color: darkMode ? '#ecf0f1' : '#586F7C' },
                        grid: { color: darkMode ? 'rgba(236, 240, 241, 0.1)' : 'rgba(88, 111, 124, 0.1)' },
                        title: {
                            display: true,
                            text: 'Custo (R$)',
                            color: darkMode ? '#ecf0f1' : '#586F7C'
                        }
                    }
                }
            }
        });
    }
    
    // Funções de validação
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function validateLoginForm() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!validateEmail(email)) {
            alert('Por favor, insira um email válido');
            return false;
        }
        
        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            return false;
        }
        
        return true;
    }
    
    function validateRegisterForm() {
        const email = document.getElementById('registerEmail').value;
        const name = document.getElementById('registerName').value;
        const password = document.getElementById('registerPassword').value;
        
        if (!validateEmail(email)) {
            alert('Por favor, insira um email válido');
            return false;
        }
        
        if (name.trim() === '') {
            alert('Por favor, insira seu nome');
            return false;
        }
        
        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            return false;
        }
        
        return true;
    }
    
    // Simulações de ações do usuário
    function simulateLogin() {
        if (validateLoginForm()) {
            navigateTo('infoScreen1');
        }
    }
    
    function simulateRegister() {
        if (validateRegisterForm()) {
            alert('Conta criada com sucesso! Faça login para continuar.');
            navigateTo('loginScreen');
        }
    }
    
    function simulatePasswordRecovery() {
        const email = document.getElementById('recoveryEmail').value;
        
        if (!validateEmail(email)) {
            alert('Por favor, insira um email válido');
            return;
        }
        
        alert(`Um link de recuperação foi enviado para ${email}`);
        navigateTo('loginScreen');
    }
    
    function connectDevice() {
        deviceConnected = true;
        navigateTo('infoScreen2');
    }
    
    // Função para alternar modo escuro
    function toggleDarkMode() {
        darkMode = !darkMode;
        
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Atualizar gráficos quando o modo escuro é alternado
        if (currentScreen === 'infoScreen2') {
            initChart1();
        } else if (currentScreen === 'infoScreen3') {
            initChart2();
        }
        
        updateBackButtonsStyle();
        updateExitButtons();
    }
    
    // Função para atualizar estilo dos botões de voltar
    function updateBackButtonsStyle() {
        const backButtons = document.querySelectorAll('.btn-back');
        backButtons.forEach(btn => {
            if (darkMode) {
                btn.style.backgroundColor = 'rgba(134, 168, 166, 0.2)';
                btn.style.color = '#ecf0f1';
            } else {
                btn.style.backgroundColor = 'rgba(184, 219, 217, 0.2)';
                btn.style.color = '#586F7C';
            }
        });
    }
    
    // Função para alternar visibilidade do painel de configurações
    function toggleConfigPanel() {
        const configPanel = document.getElementById('configPanel');
        configPanelOpen = !configPanelOpen;
        
        if (configPanelOpen) {
            configPanel.style.display = 'block';
        } else {
            configPanel.style.display = 'none';
        }
    }
    
    // Função para alternar visibilidade de elementos
    function toggleInfoElement(elementClass, show) {
        const elements = document.querySelectorAll(`.${elementClass}`);
        elements.forEach(el => {
            el.style.display = show ? 'flex' : 'none';
        });
    }
    
    // Adicionar botão para voltar à página anterior
    function addReturnButtonsToAllScreens() {
        const infoPanels = document.querySelectorAll('.info-panel');
        infoPanels.forEach((panel, index) => {
            if (index === 0) return;
            
            const returnButton = document.createElement('div');
            returnButton.classList.add('return-navigation');
            returnButton.style.marginTop = '15px';
            returnButton.style.textAlign = 'right';
            
            const returnLink = document.createElement('a');
            returnLink.href = '#';
            returnLink.textContent = 'Voltar à tela anterior';
            returnLink.style.color = '#586F7C';
            returnLink.style.textDecoration = 'none';
            returnLink.style.fontSize = '14px';
            returnLink.style.display = 'inline-flex';
            returnLink.style.alignItems = 'center';
            returnLink.style.gap = '5px';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-arrow-left';
            returnLink.prepend(icon);
            
            returnLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (previousScreen) {
                    navigateTo(previousScreen);
                }
            });
            
            returnButton.appendChild(returnLink);
            panel.appendChild(returnButton);
        });
    }
    
    // Event Listeners
    document.getElementById('loginButton').addEventListener('click', simulateLogin);
    
    document.getElementById('registerButton').addEventListener('click', () => navigateTo('registerScreen'));
    document.getElementById('goToLoginButton').addEventListener('click', () => navigateTo('loginScreen'));
    document.getElementById('createAccountButton').addEventListener('click', simulateRegister);
    document.getElementById('forgotPasswordLink').addEventListener('click', () => navigateTo('forgotPasswordScreen'));
    document.getElementById('backToLoginLink').addEventListener('click', () => navigateTo('loginScreen'));
    document.getElementById('backToLoginFromRegister').addEventListener('click', () => navigateTo('loginScreen'));
    document.getElementById('backToLoginFromRecovery').addEventListener('click', () => navigateTo('loginScreen'));
    document.getElementById('recoverPasswordButton').addEventListener('click', simulatePasswordRecovery);
    document.getElementById('connectDeviceButton').addEventListener('click', connectDevice);
    
    document.getElementById('userManualButton').addEventListener('click', () => navigateTo('userManualScreen'));
    document.getElementById('userManualButton2').addEventListener('click', () => navigateTo('userManualScreen'));
    document.getElementById('userManualButton3').addEventListener('click', () => navigateTo('userManualScreen'));
    
    document.getElementById('returnFromManualButton').addEventListener('click', function() {
        if (configPanelOpen) {
            navigateTo('infoScreen3');
        } else if (deviceConnected) {
            navigateTo('infoScreen2');
        } else {
            navigateTo('infoScreen1');
        }
    });
    
    document.getElementById('closeManualButton').addEventListener('click', function() {
        if (configPanelOpen) {
            navigateTo('infoScreen3');
        } else if (deviceConnected) {
            navigateTo('infoScreen2');
        } else {
            navigateTo('infoScreen1');
        }
    });
    
    // Event Listeners para botões de logout
    document.querySelectorAll('[id^=logoutButton]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Deseja realmente sair?')) {
                deviceConnected = false;
                configPanelOpen = false;
                navigateTo('loginScreen');
            }
        });
    });
    
    document.querySelector('.password-toggle').addEventListener('click', function() {
        togglePasswordVisibility('loginPassword', this);
    });
    
    document.querySelectorAll('.menu-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            if (this.querySelector('.fa-cog')) {
                toggleConfigPanel();
            } else if (this.querySelector('.fa-bars')) {
                navigateTo('infoScreen3');
                toggleConfigPanel();
            }
        });
    });
    
    document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
    
    document.getElementById('showVoltageToggle').addEventListener('change', function() {
        toggleInfoElement('voltage-row', this.checked);
    });
    
    document.getElementById('showConsumptionToggle').addEventListener('change', function() {
        toggleInfoElement('consumption-row', this.checked);
    });
    
    document.getElementById('showCostToggle').addEventListener('change', function() {
        toggleInfoElement('cost-row', this.checked);
    });
    
    // Inicialização
    updateLogoAndFavicon();
    updateExitButtons();
    navigateTo('loginScreen');
    addReturnButtonsToAllScreens();
});
