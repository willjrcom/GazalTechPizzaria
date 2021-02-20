package proj_vendas.vendas.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "COMPRAS")
public class Compra extends AbstractEntity<Long> {
	private String nome;
	private float valor;
}
