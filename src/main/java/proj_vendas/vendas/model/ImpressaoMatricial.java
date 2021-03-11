package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "IMPRESSAOMATRICIAL", indexes = { 
		@Index(name = "codEmpresa_index", columnList = "codEmpresa"),
		@Index(name = "setor_index", columnList = "setor")
})
public class ImpressaoMatricial extends AbstractEntity<Long>{

	@Lob
	@Column(nullable=false)
	private String impressao;
	
	@Column(nullable=false)
	private int codEmpresa;

	//A - atendimento
	//C - cozinha
	@Column(nullable=false)
	private String setor;
}
