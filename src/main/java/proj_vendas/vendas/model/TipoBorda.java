package proj_vendas.vendas.model;

public enum TipoBorda {
	CATUPIRY("Borda Catupiry"),
	CHEDDAR("Borda Cheddar"),
	VULCAO("Borda vulcão"),
	PAOZINHO("Borda Pãozinho");
	
	private String descricao;
	
	TipoBorda(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}
}
