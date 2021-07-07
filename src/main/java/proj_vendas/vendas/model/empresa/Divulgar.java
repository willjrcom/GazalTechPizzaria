package proj_vendas.vendas.model.empresa;

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
@Table(name = "DIVULGACAO")
public class Divulgar extends AbstractEntity<Long> {

	@Column
	private boolean mostrarNovidades = true;

	@Column
	private String texto1;

	@Column
	private String link1;

	@Column
	private String empresa1;

	@Column
	private String datai1;

	@Column
	private String dataf1;

	@Column
	private float valor1;
	

	@Column
	private String texto2;

	@Column
	private String link2;

	@Column
	private String empresa2;

	@Column
	private String datai2;

	@Column
	private String dataf2;

	@Column
	private float valor2;

	@Column
	private String texto3;

	@Column
	private String link3;

	@Column
	private String empresa3;

	@Column
	private String datai3;

	@Column
	private String dataf3;

	@Column
	private float valor3;

	@Column
	private String texto4;

	@Column
	private String link4;

	@Column
	private String empresa4;

	@Column
	private String datai4;

	@Column
	private String dataf4;

	@Column
	private float valor4;

	@Column
	private String texto5;

	@Column
	private String link5;

	@Column
	private String empresa5;

	@Column
	private String datai5;

	@Column
	private String dataf5;

	@Column
	private float valor5;
}


