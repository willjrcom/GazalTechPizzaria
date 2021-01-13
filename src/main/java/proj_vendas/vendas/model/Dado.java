package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "DADOS")
public class Dado extends AbstractEntity<Long> {
		
	@Column(nullable=false)
	private String data;
	@Lob
	private String logMotoboy;
	
	private double totalVendas = 0;
	private double totalLucro = 0;
	private double trocoInicio = 0;
	private double trocoFinal = 0;
	private int totalPedidos = 0;
	private int totalPizza = 0;
	private int totalProduto = 0;
	private int entrega = 0;
	private int balcao = 0;
	private int mesa = 0;
	private int drive = 0;
	private int comanda = 0;
	
	@Column(nullable=false)
	private int codEmpresa;
	
	@Lob
	private String compras;
}


