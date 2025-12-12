async function carregarLendas() {
            const tbody = document.getElementById('tabela-lendas');
            
            try {
                const response = await fetch('http://localhost:3000/lendas');
                const partidas = await response.json();

                tbody.innerHTML = ''; 

                partidas.forEach(p => {
                    // BLINDAGEM CONTRA DADOS ANTIGOS
                    const heroi = p.heroi_data || { nome: 'Desconhecido', classe: '?' };
                    const inimigo = p.inimigo_data;
                    
                    // Se o save for muito antigo e não tiver classe, usamos um padrão
                    const classeOriginal = heroi.classe || 'GUERREIRO_ANTIGO';
                    
                    let statusClass = 'status-ongoing';
                    let statusText = 'Em Jornada';

                    if (p.status === 'FINALIZADO') {
                        // Verifica se heroi existe e tem HP
                        if (heroi.hp && heroi.hp > 0) {
                            statusClass = 'status-victory';
                            statusText = 'Ascendeu';
                        } else {
                            statusClass = 'status-defeat';
                            statusText = 'Caiu';
                        }
                    }

                    const icones = {
                        'LUMINAR': '🛡️', 'ENTROPISTA': '🌀', 'CANTOR_DE_EALEN': '🎵',
                        'GUARDIAO_SINGULARIDADE': '🌌', 'SOMBRILICO': '🌑', 'VIAJANTE_TALUEN': '⏳',
                        'FORJARDENTE': '🔥', 'LUNATH_ANCESTRAL': '🌿', 'RACHADOR_HARMONIA': '🎯',
                        'MISTICO_ENTALMA': '⚛️',
                        'GUERREIRO_ANTIGO': '⚔️' // Ícone genérico para saves velhos
                    };
                    
                    const icone = icones[classeOriginal] || '⚔️';

                    const row = `
                        <tr class="legend-row">
                            <td class="avatar-cell">${icone}</td>
                            <td>
                                <span class="name-text">${heroi.nome}</span>
                                <span class="class-text">${classeOriginal.replace(/_/g, ' ')}</span>
                            </td>
                            <td>
                                <span style="color: #bbb;">Vs. ${inimigo ? inimigo.nome : 'Desconhecido'}</span>
                            </td>
                            <td>
                                <span class="status-badge ${statusClass}">${statusText}</span>
                            </td>
                        </tr>
                    `;
                    tbody.innerHTML += row;
                });

            } catch (erro) {
                console.error(erro);
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">O Silêncio impediu a leitura. Verifique o console.</td></tr>`;
            }
        }

        carregarLendas();