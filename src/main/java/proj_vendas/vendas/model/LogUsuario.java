package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "LOGUSUARIOS")
public class LogUsuario extends AbstractEntity<Long> {

	@Column(nullable=false)
	private String usuario;
	
	@Column(nullable=false)
	private String acao;
	
	@Column(nullable=false)
	private String data;
	
	@Column(nullable=false)
	private int codEmpresa;
}


