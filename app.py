from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Inicializar as torres
torres_inicial = {
    'Torre1': list(range(5, 0, -1)),  # Exemplo com 5 discos
    'Torre2': [],
    'Torre3': []
}

# Estado atual das torres (vamos copiar o estado inicial)
torres = torres_inicial.copy()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/estado_jogo')
def estado_jogo():
    return jsonify(torres)

@app.route('/mover_disco', methods=['POST'])
def mover_disco():
    origem = request.json.get('origem')
    destino = request.json.get('destino')

    # Lógica para mover o disco
    if torres[origem] and (not torres[destino] or torres[origem][-1] < torres[destino][-1]):
        disco = torres[origem].pop()
        torres[destino].append(disco)
        return jsonify(success=True)
    else:
        return jsonify(success=False)

@app.route('/recomecar', methods=['POST'])
def recomecar():
    global torres
    # Reseta o estado das torres para o estado inicial (todos os discos na Torre 1)
    torres = {
        'Torre1': list(range(5, 0, -1)),  # Reposicionar todos os discos na Torre1
        'Torre2': [],
        'Torre3': []
    }
    return jsonify(success=True)

if __name__ == "__main__":
    app.run(debug=True)
