package proj_vendas.vendas.model;

public enum TipoCargo {
	ATENDIMENTO("Atendimento"),
	MOTOBOY("Motoboy"),
	COZINHA("Cozinha"),
	PIZZAIOLO("Pizzaiolo"),
	FORNEIRO("Forneiro"),
	REPOSITOR("Repositor"),
	GERENTE("Gerente"),
	MARKETING("Marketing"),
	ANALISTA("Analista de vendas"),
	AUXILIARCOZINHA("Auxiliar de cozinha"),
	AUXILIARPIZZAIOLO("Auxiliar de pizzaiolo"),
	MENORAPRENDIZ("Menor Aprendiz");
	
	
	
	private String descricao;
	
	TipoCargo(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}
}
