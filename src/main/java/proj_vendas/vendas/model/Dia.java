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
@Table(name = "DIAS")
public class Dia extends AbstractEntity<Long> {

	@Column(nullable=false)
	private String dia;
	
	@Column(nullable=false)
	private int codEmpresa;
}
