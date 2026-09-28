package org.main.chorewars;

import org.springframework.boot.SpringApplication;

public class TestChorewarsApplication {

	public static void main(String[] args) {
		SpringApplication.from(ChorewarsApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
