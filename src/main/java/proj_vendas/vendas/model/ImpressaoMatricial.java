package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "IMPRESSAOMATRICIAL")
public class ImpressaoMatricial extends AbstractEntity<Long>{

	@Lob
	@Column(nullable=false)
	private String impressao;
	
	@Column(nullable=false)
	private int codEmpresa;
	
	public String getImpressao() {
		return impressao;
	}
	public void setImpressao(String impressao) {
		this.impressao = impressao;
	}
	public int getCodEmpresa() {
		return codEmpresa;
	}
	public void setCodEmpresa(int codEmpresa) {
		this.codEmpresa = codEmpresa;
	}
	
	
}
