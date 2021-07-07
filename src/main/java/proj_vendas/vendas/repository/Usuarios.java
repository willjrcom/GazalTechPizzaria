package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.cadastros.Usuario;

@Transactional(readOnly = true)
@Repository
public interface Usuarios extends JpaRepository<Usuario, Long>{
	
	@Query("select u from Usuario u where u.email like :email")
	public Usuario findByEmail(@Param("email") String email);

	@Query("select id, codEmpresa, dia, dataLimite, nome, email, perfil, ativo from Usuario")
	public List<String> mostrarTodos();
	
	public List<Usuario> findByCodEmpresa(Long codEmpresa);

	public List<Usuario> findByAtivo(boolean b);
	
	public static boolean isPassTrue(String senhaDigitada, String senhaArmazenada) {
		return new BCryptPasswordEncoder().matches(senhaDigitada, senhaArmazenada);
	}
}
