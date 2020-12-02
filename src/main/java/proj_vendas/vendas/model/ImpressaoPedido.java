package proj_vendas.vendas.model;

public class ImpressaoPedido {
	private String comanda;
	private String nome;
	private String nomeEstabelecimento;
	private String cnpj;
	private String enderecoEmpresa;
	
	private String envio;
	private String celular;
	private String endereco;
	private String obs;
	
	private PizzaImpressao[] pizzas;
	private ProdutoImpressao[] produtos;
	
	private double total;
	private double taxa;
	private double troco;
	
	private String texto1;
	private String texto2;
	private String promocao;
	
	private String data;
	private String hora;
	
	
	public String getComanda() {
		return comanda;
	}
	public void setComanda(String comanda) {
		this.comanda = comanda;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getNomeEstabelecimento() {
		return nomeEstabelecimento;
	}
	public void setNomeEstabelecimento(String nomeEstabelecimento) {
		this.nomeEstabelecimento = nomeEstabelecimento;
	}
	public String getEnvio() {
		return envio;
	}
	public void setEnvio(String envio) {
		this.envio = envio;
	}
	public String getCelular() {
		return celular;
	}
	public void setCelular(String celular) {
		this.celular = celular;
	}
	public String getEndereco() {
		return endereco;
	}
	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}
	public String getObs() {
		return obs;
	}
	public void setObs(String obs) {
		this.obs = obs;
	}
	public PizzaImpressao[] getPizzas() {
		return pizzas;
	}
	public void setPizzas(PizzaImpressao[] pizzas) {
		this.pizzas = pizzas;
	}
	public ProdutoImpressao[] getProdutos() {
		return produtos;
	}
	public void setProdutos(ProdutoImpressao[] produtos) {
		this.produtos = produtos;
	}
	public double getTotal() {
		return total;
	}
	public void setTotal(double total) {
		this.total = total;
	}
	public double getTaxa() {
		return taxa;
	}
	public void setTaxa(double taxa) {
		this.taxa = taxa;
	}
	public double getTroco() {
		return troco;
	}
	public void setTroco(double troco) {
		this.troco = troco;
	}
	public String getTexto1() {
		return texto1;
	}
	public void setTexto1(String texto1) {
		this.texto1 = texto1;
	}
	public String getTexto2() {
		return texto2;
	}
	public void setTexto2(String texto2) {
		this.texto2 = texto2;
	}
	public String getPromocao() {
		return promocao;
	}
	public void setPromocao(String promocao) {
		this.promocao = promocao;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String getHora() {
		return hora;
	}
	public void setHora(String hora) {
		this.hora = hora;
	}
	public String getCnpj() {
		return cnpj;
	}
	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}
	public String getEnderecoEmpresa() {
		return enderecoEmpresa;
	}
	public void setEnderecoEmpresa(String enderecoEmpresa) {
		this.enderecoEmpresa = enderecoEmpresa;
	}
}
