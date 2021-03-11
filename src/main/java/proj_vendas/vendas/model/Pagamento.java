package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(indexes = @Index(name = "data_index", columnList = "data"))
public class Pagamento extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String usuario;
	
	private String data;
	
	@Column(nullable=false)
	private String logData;
	
	private int horas = 0;
	private float taxas = 0;
	private float gastos = 0;
	private float diarias = 0;
	private float pago = 0;
}


